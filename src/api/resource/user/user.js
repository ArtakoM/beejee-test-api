import payload from '../../../utils/payload';

export const fetchProfile = (req, res) => {
  if (!req.user) {
    payload.withMessage(res, 'Не авторизован');
  }

  payload.withItem(res, req.user);
};
