import UserRepository from '../repositoy/userRepository';
import ResponseHelper from '../core/helper/responseHelper';
import { Request, Response } from 'express';

class UserController {
    private userRepository = new UserRepository()
    public searchUsers = async (req: Request, res: Response) => {
        try {
            const { searchTerm } = req.params;
            if (!searchTerm) {
                return ResponseHelper.sendError(res, 'searchTerm is null');
            }
            const users = await this.userRepository.searchUsers(searchTerm)

            return ResponseHelper.sendSuccess(res, 'success', users);
        } catch (error: any) {
            console.error(error.message);
            return ResponseHelper.sendError(res, 'error');
        }
    }
}

export default UserController;
