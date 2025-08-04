import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getUserStats, searchUsers, getUsersByRole, updateUser, deleteUser } from '@/lib/users';

// 사용자 목록 조회
export async function GET(request: NextRequest) {
  try {
    console.log('📋 사용자 목록 조회 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const stats = searchParams.get('stats');

    console.log('📋 요청 파라미터:', { search, role, stats });

    // 통계 조회
    if (stats === 'true') {
      const userStats = await getUserStats();
      console.log('✅ 사용자 통계 조회 성공:', userStats);
      return NextResponse.json({ stats: userStats });
    }

    let users;

    // 검색 조회
    if (search) {
      users = await searchUsers(search);
      console.log('🔍 사용자 검색 성공:', { searchTerm: search, count: users.length });
    }
    // 역할별 조회
    else if (role && role !== 'all') {
      users = await getUsersByRole(role);
      console.log('👥 역할별 사용자 조회 성공:', { role, count: users.length });
    }
    // 전체 조회
    else {
      users = await getAllUsers();
      console.log('👥 전체 사용자 조회 성공:', { count: users.length });
    }

    return NextResponse.json({ users });

  } catch (error: any) {
    console.error('❌ 사용자 조회 실패:', error);
    return NextResponse.json(
      { 
        error: '사용자 조회에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 사용자 정보 업데이트
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 사용자 정보 업데이트 API 호출됨');
    
    const { userId, userData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('📝 업데이트할 사용자 데이터:', { userId, userData });

    // 실제 Firebase 업데이트 호출
    await updateUser(userId, userData);

    console.log('✅ 사용자 정보 업데이트 성공:', { userId });

    return NextResponse.json({
      success: true,
      message: '사용자 정보가 업데이트되었습니다.'
    });

  } catch (error: any) {
    console.error('❌ 사용자 정보 업데이트 실패:', error);
    return NextResponse.json(
      { 
        error: '사용자 정보 업데이트에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// 사용자 삭제
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ 사용자 삭제 API 호출됨');
    
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('🗑️ 삭제할 사용자 ID:', userId);

    // 실제 Firebase 삭제 호출
    await deleteUser(userId);

    console.log('✅ 사용자 삭제 성공:', { userId });

    return NextResponse.json({
      success: true,
      message: '사용자가 삭제되었습니다.'
    });

  } catch (error: any) {
    console.error('❌ 사용자 삭제 실패:', error);
    return NextResponse.json(
      { 
        error: '사용자 삭제에 실패했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}