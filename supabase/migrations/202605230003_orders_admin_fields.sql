-- Order fields used by the public contact form and /admin/orders.

alter table public.orders
  add column if not exists vehicle_make_model text,
  add column if not exists urgency text not null default 'normal',
  add column if not exists preferred_time text,
  add column if not exists admin_note text,
  add column if not exists assigned_to text;

update public.orders
set
  vehicle_make_model = coalesce(
    nullif(vehicle_make_model, ''),
    trim(concat_ws(' ', nullif(vehicle_make, ''), nullif(vehicle_model, '')))
  )
where vehicle_make_model is null or vehicle_make_model = '';

create index if not exists idx_orders_urgency_created on public.orders(urgency, created_at desc);
create index if not exists idx_orders_assigned_status on public.orders(assigned_to, status);
