import { NextResponse } from "next/server";
import { products } from "@/lib/data/products";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const index = products.findIndex(p => p.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
  return NextResponse.json(products[index]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const index = products.findIndex(p => p.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  
  const deleted = products.splice(index, 1)[0];
  return NextResponse.json(deleted);
}