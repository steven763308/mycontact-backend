// tests/eWalletService-test.js
const chai = require('chai');
const expect = chai.expect;
const { User, EwalletProfile, EwalletTransaction, EwalletCoin, ActiveBonusTransaction } = require('../models/index');
const bcrypt = require('bcrypt');
const faker = require('faker');
const ewalletService = require('../services/ewalletService');
const userService = require('../services/userService');
const CustomError = require('../utils/customError');
const { sequelize } = require('../config/database');

describe('eWallet Service Tests', () => {


describe('Transfer Tests', () => {
        beforeEach(async () => {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
            await ActiveBonusTransaction.destroy({ truncate: true, cascade: true });
            await EwalletTransaction.destroy({ truncate: true, cascade: true });
            await EwalletProfile.destroy({ truncate: true, cascade: true });
            await EwalletCoin.destroy({ truncate: true, cascade: true });
            await User.destroy({ truncate: true, cascade: true });
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

            // Create eWallet coins
            coinA = await EwalletCoin.create({ name: 'Coin A', symbol: 'CA' });
            coinB = await EwalletCoin.create({ name: 'Coin B', symbol: 'CB' });
            coinAId = coinA.id;
            coinBId = coinB.id;

            // Create mock admin
            const hashedAdminPassword = await bcrypt.hash('11111', 10);
            const mockAdmin = await User.create({
                username: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'admin@example.com',
                password: hashedAdminPassword,
                role: 'admin'
            });
            mockAdminId = mockAdmin.id;

            // Create mock user
            const hashedUserPassword = await bcrypt.hash('11111', 10);
            rootUser = await User.create({
                username: 'root',
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'rootuser@example.com',
                password: hashedUserPassword,
                role: 'member'
            });
            users['RootUser'] = rootUser.id;



            // Create eWallet profiles for the user with coins A and B
            initialBalance = 0;
            await createEwalletProfiles(rootUser.id);

            const aliceData = {
                username: 'Alice',
                firstName: 'Alice',
                lastName: 'Doe',
                email: 'alice@example.com',
                password: 'password123',
                packageId: 1,
                parentUsername: rootUser.username,
                position: 'left'
            };
            // Mock request object
            const mockReq = { user: rootUser }; // Adjust this based on what addChild expects in req
            // Call addChild function
            let result = await userService.addChild(mockReq, aliceData, null);
            const aliceId = result.child.id;
            users['Alice'] = aliceId;
            await createEwalletProfiles(aliceId);


            const bobData = {
                username: 'Bob',
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob@example.com',
                password: 'password456',
                packageId: 1,
                parentUsername: rootUser.username,
                position: 'right'
            };
            result = await userService.addChild(mockReq, bobData, null);
            const bobId = result.child.id;
            users['Bob'] = bobId;
            await createEwalletProfiles(bobId);

        });

        it('should allow transfer within the referral chain', async () => {
            // Example: RootUser transfers to Alice
            await ewalletService.deposit(users['RootUser'], coinAId, 500);
            const transferAmount = 100;
            await ewalletService.transfer(users['RootUser'], 'Alice', coinAId, transferAmount);

            const aliceEwallet = await EwalletProfile.findOne({ where: { userId: users['Alice'], coinId: coinAId } });

            const aliceBalance = parseFloat(aliceEwallet.balance);
            const expectedBalance = initialBalance + transferAmount;
            expect(aliceBalance).to.equal(expectedBalance);
        });

        it('should not allow transfer outside the referral chain #1', async () => {

            const transferAmount = 100;
            try {
                await ewalletService.transfer(users['Alice'], 'Bob', coinAId, transferAmount);
                throw new Error('Transfer outside the referral chain should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.equal('Transfer not allowed. Transfer is only allowed within the referral chain.');
            }
        });

        beforeEach(async () => {
            const charlieData = {
                username: 'Charlie',
                firstName: 'Charlie',
                lastName: 'Brown',
                email: 'charlie@example.com',
                password: 'password789',
                packageId: 1,
                parentUsername: 'Alice',
                position: 'left' // Assuming a position, adjust as needed
            };

            // Create user Diana under Bob
            const dianaData = {
                username: 'Diana',
                firstName: 'Diana',
                lastName: 'Prince',
                email: 'diana@example.com',
                password: 'password101',
                packageId: 1,
                parentUsername: 'Bob',
                position: 'right' // Assuming a position, adjust as needed
            };

            // Mock request object
            let mockReq = { user: { id: users['Alice'] } };

            // Call addChild function for Charlie
            let result = await userService.addChild(mockReq, charlieData, null);
            const charlieId = result.child.id;
            users['Charlie'] = charlieId;
            await createEwalletProfiles(charlieId);
            await ewalletService.deposit(users['Charlie'], coinAId, 300);

            mockReq = { user: { id: users['Bob'] } };
            result = await userService.addChild(mockReq, dianaData, null);
            const dianaId = result.child.id;
            users['Diana'] = dianaId;

            // Create eWallet profiles for Diana
            await createEwalletProfiles(dianaId);

        })

        it('should not allow transfer outside the referral chain #2', async () => {

            const transferAmount = 100;
            try {
                await ewalletService.transfer(users['Charlie'], 'Bob', coinAId, transferAmount);
                throw new Error('Transfer outside the referral chain should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.equal('Transfer not allowed. Transfer is only allowed within the referral chain.');
            }
        });

        it('should not allow transfer if sender has insufficient funds', async () => {
            const transferAmount = 2000; // Assumed to be more than the sender's balance
            try {
                await ewalletService.transfer(users['Alice'], 'Charlie', coinAId, transferAmount);
                throw new Error('Expected transfer to fail due to insufficient funds, but it succeeded');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.equal('Insufficient funds.');
            }
        });

        it('should not allow transfer to a non-existent user', async () => {
            const transferAmount = 50;
            try {
                await ewalletService.transfer(users['Alice'], 'NonExistentUser', coinAId, transferAmount);
                throw new Error('Expected transfer to fail due to non-existent recipient, but it succeeded');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.equal('Invalid username.');
            }
        });


        it('should not allow transfer of zero or negative amount', async () => {
            const transferAmount = 0; // or a negative value
            try {
                await ewalletService.transfer(users['Alice'], 'Bob', coinAId, transferAmount);
                throw new Error('Expected transfer to fail due to invalid amount, but it succeeded');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                // Check for an appropriate error message
            }
        });

    });

    describe('Convert Tests', () => {
        beforeEach(async () => {
            // Clean up the tables for testing. WARNING: This will destroy data!
            await ActiveBonusTransaction.destroy({ where: {} });
            await EwalletTransaction.destroy({ where: {} });
            await EwalletProfile.destroy({ where: {} });
            await EwalletCoin.destroy({ where: {} });
            await User.destroy({ where: {} });

            // Create eWallet coins
            coinA = await EwalletCoin.create({ name: 'Coin A', symbol: 'CoinA' });
            coinB = await EwalletCoin.create({ name: 'Coin B', symbol: 'CoinB' });
            coinAId = coinA.id;
            coinBId = coinB.id;

            // Create mock admin
            const hashedAdminPassword = await bcrypt.hash('11111', 10);
            const mockAdmin = await User.create({
                username: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'admin@example.com',
                password: hashedAdminPassword,
                role: 'admin'
            });
            mockAdminId = mockAdmin.id;

            // Create mock user
            const hashedUserPassword = await bcrypt.hash('11111', 10);
            rootUser = await User.create({
                username: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: 'rootuser@example.com',
                password: hashedUserPassword,
                role: 'member'
            });
            console.log("Root user created with ID:", rootUser.id);
            mockUserId = rootUser.id;

            // Create eWallet profiles for the user with coins A and B
            initialBalance = 0;
            await EwalletProfile.create({
                userId: mockUserId,
                coinId: coinAId,
                balance: initialBalance
            });
            await EwalletProfile.create({
                userId: mockUserId,
                coinId: coinBId,
                balance: initialBalance
            });
        });

        it('should successfully convert from coinA to USDT', async () => {
            // Setup for successful conversion
            const depositAmount = 100;
            const amountToConvert = 50;
            const cryptoTokenSymbol = 'USDT';

            await ewalletService.deposit(mockUserId, coinAId, depositAmount);
            await ewalletService.convert(mockUserId, coinAId, cryptoTokenSymbol, amountToConvert);

            // Assertions for success, check balances, etc.
            const updatedProfile = await EwalletProfile.findOne({ where: { userId: mockUserId, coinId: coinAId } });
            const updatedBalance = parseFloat(updatedProfile.balance);
            expect(updatedBalance).to.equal(depositAmount - amountToConvert);// As balance should decrease after conversion
        });

        it('should fail to convert due to insufficient balance', async () => {
            const amountToConvert = 200; // Amount greater than initial balance
            const cryptoTokenSymbol = 'USDT';

            try {
                await ewalletService.convert(mockUserId, coinAId, cryptoTokenSymbol, amountToConvert);
                throw new Error('Expected conversion to fail due to insufficient funds, but it succeeded');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.equal('Insufficient eWallet balance.');
            }
        });

        it('should fail to convert due to invalid user', async () => {
            const invalidUserId = 9999; // Non-existent user ID
            const amountToConvert = 50;
            const cryptoTokenSymbol = 'USDT';

            try {
                await ewalletService.convert(invalidUserId, coinAId, cryptoTokenSymbol, amountToConvert);
                throw new Error('Expected conversion to fail due to invalid user, but it succeeded');
            } catch (error) {
                expect(error).to.be.instanceOf(CustomError);
                expect(error.message).to.include('User not found.'); // Assuming this is the error message for invalid user
            }
        });

        it('should apply the correct exchange rate for CoinA to USDT conversion', async () => {
            const depositAmount = 100;
            const amountToConvert = 50;
            const cryptoTokenSymbol = 'USDT';
            const expectedRate = 0.80; // As defined in exchangeRateConfig.js

            await ewalletService.deposit(mockUserId, coinAId, depositAmount);
            const conversionResult = await ewalletService.convert(mockUserId, coinAId, cryptoTokenSymbol, amountToConvert);

            // Parse the converted amount to a float
            const convertedAmount = parseFloat(conversionResult.convertedAmount);

            // Check if the converted amount is as expected
            const expectedConvertedAmount = amountToConvert * expectedRate;
            expect(convertedAmount).to.be.closeTo(expectedConvertedAmount, 0.0000000001);
        });
    });
});
