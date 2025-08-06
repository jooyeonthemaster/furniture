import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 사용자 통계 API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // 기본 데이터
    const defaultData = {
      totalUsers: 0,
      monthlyUsers: 0,
      growth: 0,
      roleDistribution: [
        { role: '고객', count: 0, percentage: 0 },
        { role: '딜러', count: 0, percentage: 0 },
        { role: '관리자', count: 0, percentage: 0 }
      ],
      monthlyTrends: [],
      activityStats: {
        totalUsers: 0,
        newUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        retentionRate: 0
      },
      averageConversionTime: 0,
      conversionRate: 0
    };

    try {
      // 사용자 데이터 조회
      const usersSnapshot = await getDocs(collection(db, 'users'));
      console.log('👥 사용자 컬렉션 문서 수:', usersSnapshot.docs.length);

      if (usersSnapshot.docs.length > 0) {
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          role: doc.data().role || 'customer'
        }));

        defaultData.totalUsers = users.length;
        defaultData.monthlyUsers = users.length;

        // 역할별 분포
        const roleCounts: { [key: string]: number } = {};
        users.forEach(user => {
          const displayRole = getUserRoleDisplayName(user.role);
          roleCounts[displayRole] = (roleCounts[displayRole] || 0) + 1;
        });

        defaultData.roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
          role,
          count,
          percentage: users.length > 0 ? (count / users.length) * 100 : 0
        }));

        defaultData.activityStats = {
          totalUsers: users.length,
          newUsers: 0,
          activeUsers: 0,
          inactiveUsers: users.length,
          retentionRate: 0
        };
      }

    } catch (firebaseError) {
      console.error('Firebase 연결 에러:', firebaseError);
    }

    return NextResponse.json(defaultData);

  } catch (error) {
    console.error('❌ 사용자 통계 조회 실패:', error);
    return NextResponse.json({
      totalUsers: 0,
      monthlyUsers: 0,
      growth: 0,
      roleDistribution: [],
      monthlyTrends: [],
      activityStats: {
        totalUsers: 0,
        newUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        retentionRate: 0
      },
      averageConversionTime: 0,
      conversionRate: 0
    });
  }
}

function getUserRoleDisplayName(role: string): string {
  const roleMap: { [key: string]: string } = {
    'customer': '고객',
    'dealer': '딜러', 
    'admin': '관리자'
  };
  return roleMap[role] || role;
}