import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  currentUser,
} from '../common';
import { User, UserAttrs } from '../models/user';
const router = express.Router();

router.patch(
  '/api/users/:userId',
  [
    body('email').isEmail().optional().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .optional()
      .withMessage('Password must be between 4 and 20 characters'),
    body('age').isInt({ gt: 0, lt: 150 }).optional().withMessage('Age invalid'),
    param('userId').isMongoId().withMessage('Invalid Id'),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      name,
      gender,
      age,
    }: { newPassword: string } & UserAttrs = req.body;

    if (req.currentUser?.id !== req.params.userId) {
      // console.log(req.currentUser?.id);
      // console.log(req.params.id);
      throw new NotAuthorizedError();
    }

    const user = await User.findOne({ userId: req.params.userId });

    if (!user) {
      throw new NotFoundError();
    }

    // if email property provided then set as new email otherwise old email. similar for other
    
    
      user.set({
        email: email ?? user.email,
        password: password ?? user.password,
        name: name ?? user.name,
        gender: gender ?? user.gender,
        age: age ?? user.age,

      });
    await user.save();
    // Generate new JWT for updated user property
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // update the session object
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(user);
  }
);

export { router as updateUserRouter };
