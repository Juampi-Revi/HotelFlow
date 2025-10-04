# Testing Plan for Categories & Rooms

## Backend
- Unit tests: `CategoryService` create/update/delete/toggleActive, uniqueness validation.
- Unit tests: `RoomService` create/update mapping `categoryId` to `Category` and nulling when absent.
- Integration tests (MockMvc):
  - `GET /api/categories` returns list with `isActive` values.
  - `GET /api/rooms?categoryId={id}` filters by category.
  - `GET /api/rooms?categorySlug={slug}` filters by category.
  - `POST /api/rooms` accepts `categoryId` and persists relation.
  - Error cases: non-existent `categoryId` returns 404.

## Frontend
- Manual checks:
  - Admin Rooms form shows Category selector with active categories.
  - Creating/updating a room persists `categoryId` correctly (verify via API/console).
  - Catalog page filter by Category loads and displays only matching rooms.
  - i18n labels for Category appear in EN/ES.
- Automated tests (future):
  - Component test for `RoomForm` rendering Category field and change handler.
  - Hook test for `useRoomsPagination` category filtering behavior.
  - Service tests: `roomService.getRoomsByCategoryId/Slug` request URL correctness.

## Data setup
- Seed at least 2 active categories and 1 inactive.
- Seed rooms with and without category for filter validation.