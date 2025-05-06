// src/app/api/payments/invoice/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  const { id } = request.nextUrl.pathname.match(/\/invoice\/([^\/]+)/)?.groups || {};
  // Alternative way to get id from URL
  const segments = request.nextUrl.pathname.split('/');
  const paymentId = segments[segments.length - 1];

  if (!paymentId) {
    return NextResponse.json({ error: 'ID de paiement manquant' }, { status: 400 });
  }

  try {
    // In a real app, fetch the invoice file path or data from DB or storage based on paymentId
    // Here, simulate by reading a static PDF file or generating a dummy PDF content

    // Example: static invoice file path (adjust as needed)
    const invoiceFilePath = path.resolve('public/invoices', `${paymentId}.pdf`);

    if (!fs.existsSync(invoiceFilePath)) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(invoiceFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${paymentId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de la facture:', error);
    return NextResponse.json({ error: 'Erreur serveur lors du téléchargement de la facture' }, { status: 500 });
  }
}


