import connectDb from '../../../lib/mongodb';
import Product from '../../../models/Products';

export async function GET(request) {
  try {
    await connectDb();
    
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ message: 'Error fetching products.' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, price, imageUrl } = await request.json();

    await connectDb();

    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();

    return new Response(JSON.stringify({ message: 'Product added successfully.' }), { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return new Response(JSON.stringify({ message: 'Error adding product.' }), { status: 500 });
  }
}
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const { productId, name, description, price, image } = Object.fromEntries(formData);

    await connectDb();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, imageUrl:image },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: 'Product not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Product updated successfully.', product: updatedProduct }), { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ message: 'Error updating product.' }), { status: 500 });
  }
}