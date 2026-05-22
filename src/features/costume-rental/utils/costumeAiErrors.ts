import { mapAiFeatureError } from '@/features/profile/utils/aiTokenErrors';

export function mapGenerateDescriptionError(error: unknown): string {
  return mapAiFeatureError(error, 'Không thể tạo mô tả bằng AI.');
}
