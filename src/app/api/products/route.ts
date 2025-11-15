import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.name || !data.category || !data.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Product with this name already exists,' }, { status: 409 });
    }
    
    let calculatedQty = Number(data.quantity) || 0;
    if (data.ramOptions && Array.isArray(data.ramOptions) && data.ramOptions.length > 0) {
      calculatedQty = data.ramOptions.reduce((sum: number, opt: any) => sum + (opt.quantity || 0), 0);
    }
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description || '',
        frontImage: data.frontImage || '',
        images: Array.isArray(data.images) ? data.images : [],
        price: Number(data.price),
        mrp: Number(data.mrp) || Number(data.price),
        stock: calculatedQty,
        quantity: calculatedQty,
        brand: data.brand || '',
        modelName: data.modelName || '',
        warranty: data.warranty || '',
        warrantyType: data.warrantyType || '',
        screenSize: data.screenSize || '',
        cpuModel: data.cpuModel || '',
        operatingSystem: data.operatingSystem || '',
        graphics: data.graphics || '',
        color: data.color || '',
        boxContents: data.boxContents || '',
        status: data.status || 'active',
        sku: data.sku || `SKU-${Date.now()}`,
        ramOptions: data.ramOptions || [],
        storageOptions: data.storageOptions || [],
        warrantyOptions: data.warrantyOptions || []
      } as any
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

