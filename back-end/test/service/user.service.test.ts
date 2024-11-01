import { User } from "../../model/user";
import userService from "../../service/user.service";
import userDB from '../../repository/user.db';

jest.mock('../../repository/user.db'); // Mock the userDB module

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getAllUsers', () => {
        it('should return all users from the database', () => {
            // Arrange: Set up mock data and return value
            const mockUsers = [
                new User('John Doe', 'john.doe@gmail.com' ),
                new User('Jane Doe', 'jane.doe@gmail.com' ),
            ];
            (userDB.getAllUsers as jest.Mock).mockReturnValue(mockUsers);

            // Act: Call the function
            const result = userService.getAllUsers();

            // Assert: Verify the result
            expect(result).toEqual(mockUsers);
            expect(userDB.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserById', () => {
        it('should return a user if the user exists', () => {
            // Arrange
            const mockUser = new User('John Doe', 'john.doe@gmail.com' );
            (userDB.getUserById as jest.Mock).mockReturnValue(mockUser);

            // Act
            const result = userService.getUserById(1);

            // Assert
            expect(result).toEqual(mockUser);
            expect(userDB.getUserById).toHaveBeenCalledTimes(1);
            expect(userDB.getUserById).toHaveBeenCalledWith(1);
        });

        it('should throw an error if the user does not exist', () => {
            // Arrange
            (userDB.getUserById as jest.Mock).mockReturnValue(null);

            // Act and Assert
            expect(() => userService.getUserById(999)).toThrow('User with id 999 does not exist.');
            expect(userDB.getUserById).toHaveBeenCalledTimes(1);
            expect(userDB.getUserById).toHaveBeenCalledWith(999);
        });
    });
});
