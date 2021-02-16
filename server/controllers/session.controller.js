import passport from 'passport';

import { userResponse } from './user.controller';

export function createSession(req, res, next) {
  passport.authenticate('local', (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password.' });
      return;
    }

    req.logIn(user, (innerErr) => {
      if (req.body.remember) {
        req.session.cookie.originalMaxAge = 30 * 24 * 60 * 60 * 1000;
      } else {
        req.session.cookie.expires = false;
      }
      if (innerErr) { return next(innerErr); }
      return res.json(userResponse(req.user));
    });
  })(req, res, next);
}

export function getSession(req, res) {
  if (req.user) {
    return res.json(userResponse(req.user));
  }
  return res.status(404).send({ message: 'Session does not exist' });
}

export function destroySession(req, res) {
  req.logout();
  res.json({ success: true });
}
