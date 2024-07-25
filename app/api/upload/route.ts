import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import uploadFile from '@/utils/uploadImage';
import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';

export const runtime = 'nodejs';
// export const api = {
//   bodyParser: false,
// };

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const mainImage = formData.get('mainImage') as File;
  const additionalImages = formData.getAll('additionalImages') as File[];

  if (!mainImage) {
    return NextResponse.json({ error: 'Main image is required' }, { status: 400 });
  }

  try {
    // Save main image to temporary file
    const mainImageBuffer = await mainImage.arrayBuffer();
    const mainImagePath = `/tmp/${uuidv4()}-${mainImage.name}`;
    await fs.writeFile(mainImagePath, Buffer.from(mainImageBuffer));

    // Upload main image
    const mainImageUrl = await uploadFile(mainImagePath, mainImage.name);

    // Process additional images
    const additionalImageUrls = await Promise.all(
      additionalImages.map(async (image) => {
        const imageBuffer = await image.arrayBuffer();
        const imagePath = `/tmp/${uuidv4()}-${image.name}`;
        await fs.writeFile(imagePath, Buffer.from(imageBuffer));
        return uploadFile(imagePath, image.name);
      })
    );

    // Clean up temporary files
    await fs.unlink(mainImagePath);
    await Promise.all(additionalImages.map((_, index) => fs.unlink(`/tmp/${uuidv4()}-${additionalImages[index].name}`)));

    // Connect to MongoDB
    await dbConnect();

    // Prepare item data
    const itemData = {
      name: formData.get('name'),
      size: formData.getAll('size'),
      mainColor: formData.get('mainColor'),
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description'),
      gender: formData.get('gender'),
      category: formData.get('category'),
      style: formData.get('style'),
      saleDiscount: parseFloat(formData.get('saleDiscount') as string),
      quantity: parseInt(formData.get('quantity') as string, 10),
      images: [
        { url: mainImageUrl.split('/').pop() || '', main: true },
        ...additionalImageUrls.map((url: string) => ({ url: url.split('/').pop() || '', main: false }))
      ]
    };

    // Save item to MongoDB
    const item = new Item(itemData);
    await item.save();

    return NextResponse.json({ success: true, item: { ...item.toObject(), id: item._id } });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}
