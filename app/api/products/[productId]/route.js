import connectDb  from '../../../../lib/mongodb'; // Adjust based on your project structure
import Product from '../../../../models/Products'; // Adjust based on your project structure

export async function GET(request,{params}) {
    
    
    const { productId } = params;
    
    try {
    
      
      await connectDb();
      const product = await Product.findById(productId);
    

    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ message: 'Error fetching product.' }), { status: 500 });
  }
}
