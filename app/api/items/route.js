import dbConnect from '../../../lib/dbConnect';
import Item from '../../../models/Item';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const items = await Item.find({}).skip(skip).limit(limit);
    const total = await Item.countDocuments();
    const pages = Math.ceil(total / limit);

    return NextResponse.json({ success: true, data: items, total, pages });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  const body = await req.json();
  await dbConnect();

  try {
    console.log('Request body:', body);  // Log request body
    const item = await Item.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await dbConnect();

  try {
    await Item.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();
  await dbConnect();

  try {
    const item = await Item.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
