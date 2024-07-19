import dbConnect from '../../../lib/dbConnect';
import Item from '../../../models/Item';

export default async function handler(req, res) {
  const { method } = req;
  const { itemId } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const item = await Item.findOne({ itemId });
        if (!item) {
          return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
