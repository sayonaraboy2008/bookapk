-- ====================================================================
-- FOLIO: YAGONA PLATFORMA BAZA STRUKTURASI (LIKES, READS, ADMIN ANALYTICS)
-- ====================================================================

create extension if not exists "uuid-ossp";

-- 1. Foydalanuvchi profillari
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default 'Kitobxon',
    email text,
    avatar_url text default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    role text default 'user' check (role in ('admin', 'user')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Kitoblar jadvali (likes_count va reads_count bilan)
create table if not exists public.books (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    author text not null,
    description text,
    category text default 'Fiction',
    genre text default 'Fiction',
    rating numeric(3, 1) default 4.8,
    reviews text default '1.5k',
    file_size text default '2.4 MB',
    cover_url text,
    cover_color text default '#101c34',
    text_color text default '#ffffff',
    pdf_url text not null,
    total_pages integer default 180,
    downloads_count integer default 0,
    reads_count integer default 0,
    likes_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Kitob izohlari
create table if not exists public.comments (
    id uuid primary key default uuid_generate_v4(),
    book_id uuid references public.books(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete set null,
    user_name text default 'Reader' not null,
    content text not null,
    rating integer check (rating >= 1 and rating <= 5) default 5,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Indekslar
create index if not exists idx_books_title on public.books using gin(to_tsvector('simple', title));
create index if not exists idx_books_author on public.books using gin(to_tsvector('simple', author));
create index if not exists idx_books_downloads on public.books(downloads_count desc);
create index if not exists idx_books_reads on public.books(reads_count desc);
create index if not exists idx_books_likes on public.books(likes_count desc);
create index if not exists idx_books_rating on public.books(rating desc);

-- 5. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.comments enable row level security;

create policy "Profillarni hamma ko'rishi mumkin" on public.profiles for select using (true);
create policy "Profillarni tahrirlash" on public.profiles for update using (auth.uid() = id);

create policy "Kitoblarni hamma ko'rishi mumkin" on public.books for select using (true);
create policy "Kitoblarni kiritish va tahrirlash" on public.books for all using (true) with check (true);

create policy "Izohlarni hamma ko'rishi mumkin" on public.comments for select using (true);
create policy "Izoh qoldirish" on public.comments for insert with check (true);

-- 6. Trigger: Yangi user uchun profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Kitobxon'), new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Realtime Replikatsiya
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.books, public.comments, public.profiles;
commit;

-- 8. Real-vaqt hisoblagich RPC funksiyalari
create or replace function increment_book_downloads(book_id_param uuid)
returns void as $$
begin
    update public.books
    set downloads_count = downloads_count + 1
    where id = book_id_param;
end;
$$ language plpgsql security definer;

create or replace function increment_book_reads(book_id_param uuid)
returns void as $$
begin
    update public.books
    set reads_count = reads_count + 1
    where id = book_id_param;
end;
$$ language plpgsql security definer;

create or replace function increment_book_likes(book_id_param uuid)
returns void as $$
begin
    update public.books
    set likes_count = likes_count + 1
    where id = book_id_param;
end;
$$ language plpgsql security definer;

create or replace function decrement_book_likes(book_id_param uuid)
returns void as $$
begin
    update public.books
    set likes_count = greatest(0, likes_count - 1)
    where id = book_id_param;
end;
$$ language plpgsql security definer;

-- 9. Dastlabki ma'lumotlar (Boshlang'ich likes va reads soni bilan)
insert into public.books (title, author, genre, category, rating, reviews, file_size, cover_color, text_color, pdf_url, total_pages, description, reads_count, likes_count, downloads_count)
values
(
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    'Fiction',
    'Fiction',
    4.7,
    '2.4k',
    '1.8 MB',
    '#101c34',
    '#e6c875',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    180,
    'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway interactions with mysterious Jay Gatsby.',
    4820,
    1420,
    3200
),
(
    'Pride and Prejudice',
    'Jane Austen',
    'Fiction',
    'Fiction',
    4.8,
    '3.1k',
    '2.2 MB',
    '#fdf8f2',
    '#3b2214',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    240,
    'A romantic novel following Elizabeth Bennet as she deals with issues of manners and marriage.',
    3910,
    1150,
    2850
),
(
    'Clean Code',
    'Robert C. Martin',
    'IT',
    'IT',
    4.6,
    '1.8k',
    '5.4 MB',
    '#e35a1f',
    '#ffffff',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    464,
    'A handbook of agile software craftsmanship for creating readable, robust code.',
    6100,
    1890,
    4100
),
(
    'Designing Data-Intensive Applications',
    'Martin Kleppmann',
    'IT',
    'IT',
    4.9,
    '1.2k',
    '8.6 MB',
    '#1b539c',
    '#ffffff',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    590,
    'The definitive guide to the architecture and scalability of modern data storage systems.',
    5240,
    1680,
    3600
),
(
    'Atomic Habits',
    'James Clear',
    'Business',
    'Business',
    4.8,
    '4.6k',
    '3.1 MB',
    '#fdfbf7',
    '#1a1f2c',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    320,
    'An easy and proven way to build good habits and break bad ones.',
    8420,
    2530,
    5200
),
(
    'The Psychology of Money',
    'Morgan Housel',
    'Business',
    'Business',
    4.7,
    '2.8k',
    '2.6 MB',
    '#224233',
    '#ffffff',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    256,
    'Timeless lessons on wealth, greed, and happiness.',
    4930,
    1340,
    3900
),
(
    'A Brief History of Time',
    'Stephen Hawking',
    'Science',
    'Science',
    4.6,
    '2.1k',
    '4.2 MB',
    '#0e172a',
    '#ffffff',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    212,
    'From the Big Bang to black holes, exploring cosmological evolution.',
    3200,
    980,
    2400
),
(
    'The Hidden Life of Trees',
    'Peter Wohlleben',
    'Science',
    'Science',
    4.5,
    '964',
    '3.8 MB',
    '#44543b',
    '#ffffff',
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    288,
    'How trees communicate, support one another, and live in community networks.',
    2600,
    740,
    1800
);
