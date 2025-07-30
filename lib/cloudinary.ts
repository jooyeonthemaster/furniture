// 클라우디너리 업로드 유틸리티 함수

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  file: File, 
  folder: string = 'furniture'
): Promise<CloudinaryUploadResult> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name이 설정되지 않았습니다.');
    }

    // FormData 생성 (Unsigned 업로드)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'furniture'); // 클라우디너리에서 설정한 preset 이름
    formData.append('folder', folder);
    
    // Unsigned 업로드에서는 이미지 최적화 설정을 Upload Preset에서 설정해야 함

    console.log('업로드 시작:', file.name, '→', folder);

    // Cloudinary 업로드
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('Cloudinary 응답 에러:', errorData);
      throw new Error(`Cloudinary 업로드 실패: ${uploadResponse.status}`);
    }

    const result = await uploadResponse.json();
    console.log('업로드 성공:', result.secure_url);

    // 고품질 최적화된 URL 생성
    const optimizedUrl = result.secure_url.replace(
      '/upload/',
      '/upload/f_auto,q_auto:best/'
    );

    return {
      public_id: result.public_id,
      secure_url: optimizedUrl, // 최적화된 URL 반환
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
}

export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = 'furniture',
  onProgress?: (index: number, total: number) => void
): Promise<CloudinaryUploadResult[]> {
  const results: CloudinaryUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      onProgress?.(i, files.length);
      const result = await uploadToCloudinary(files[i], folder);
      results.push(result);
    } catch (error) {
      console.error(`파일 ${files[i].name} 업로드 실패:`, error);
      // 개별 파일 실패는 전체를 중단시키지 않음
    }
  }
  
  onProgress?.(files.length, files.length);
  return results;
} 