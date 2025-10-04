# I18n Strategy for Category Content

## Goal
Enable multilingual names and descriptions for categories (EN/ES), while keeping stable `slug` identifiers for routing and filtering.

## Approach Options
- Single table with translation fields:
  - Add `nameEn`, `nameEs`, `descriptionEn`, `descriptionEs` to `Category`.
  - Pros: Simple, fewer joins. Cons: Harder to extend beyond EN/ES.
- Translation entity per locale (recommended):
  - New `CategoryTranslation { id, categoryId, locale, name, description }`.
  - `Category` keeps canonical `slug`, `isActive`.
  - Pros: Extensible to more locales, cleaner separation.

## DTOs
- Response DTO includes both base and current locale fields:
  - `name`, `description` resolved by requested locale.
  - Optional: add `translations` array for admin editing.
- Request DTO for admin editing supports adding/updating translations.

## API
- Query parameter `lang` for category endpoints and room list endpoints:
  - `GET /api/categories?lang=en` returns localized `name/description`.
  - `GET /api/rooms?categorySlug=beach&lang=es` returns rooms, each with localized category fields.

## Frontend
- Use i18n language (`i18n.language`) when requesting categories/rooms.
- Fall back to base `name`/`description` if translation missing.
- Admin UI: editing translations with tabs per locale.

## Migration
- Existing `name/description` stay as default locale.
- Seed translations from current values for EN/ES.

## Notes
- Keep `slug` stable regardless of locale.
- Validate uniqueness per `slug`, not per localized name.