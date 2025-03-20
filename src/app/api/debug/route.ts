import { NextResponse } from 'next/server';
import axios from 'axios';

// Cette route permet de tester la connexion à l'API backend
export async function GET(request: Request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    // Test de connexion simple
    const pingResult = await axios.get(`${API_URL}/categories/`, {
      timeout: 5000 // 5 secondes maximum
    });
    
    return NextResponse.json({
      apiUrl: API_URL,
      status: 'success',
      statusCode: pingResult.status,
      data: pingResult.data,
      headers: Object.fromEntries(
        Object.entries(pingResult.headers).filter(([key]) => 
          !['set-cookie', 'cookie'].includes(key.toLowerCase())
        )
      ),
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        // Ne pas inclure NEXTAUTH_SECRET pour des raisons de sécurité
        HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
      }
    });
  } catch (error) {
    console.error('API Debug Error:', error);
    
    let errorData: any = {
      message: 'Unknown error occurred'
    };
    
    if (axios.isAxiosError(error)) {
      errorData = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      };
    } else if (error instanceof Error) {
      errorData = {
        message: error.message,
        name: error.name
      };
    }
    
    return NextResponse.json({
      apiUrl: API_URL,
      status: 'error',
      error: errorData,
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
      }
    }, { status: 500 });
  }
}