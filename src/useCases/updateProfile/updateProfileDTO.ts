import { PREFERED_LANGUAGES } from '../../domain/user'

export interface UpdateProfileDTO {
  userId: string
  phone?: string
  displayName?: string
  preferredLanguage?: PREFERED_LANGUAGES
  pictureUrl?: string
}
