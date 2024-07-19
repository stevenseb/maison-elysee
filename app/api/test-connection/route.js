import dbConnect from '../../../lib/dbConnect';
import Item from '../../../models/Item';

export async function GET(req) {
  await dbConnect();

  try {
    const items = await Item.find({}).limit(1); // Fetch one item as a test
    return new Response(JSON.stringify({ success: true, data: items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
