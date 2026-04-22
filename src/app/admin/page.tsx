import AdminCard from '@/components/admin/AdminCard'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminPage() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Planetlocksmiths / Admin"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        <AdminCard
          href="/admin/settings"
          title="Settings"
          description="Brand, phone, email, service hours, and global project settings."
        />

        <AdminCard
          href="/admin/home"
          title="Home"
          description="Homepage hero, CTA blocks, featured services, and homepage copy."
        />

        <AdminCard
          href="/admin/services"
          title="Services"
          description="Manage service pages, SEO fields, content sections, and publish states."
        />

        <AdminCard
          href="/admin/areas"
          title="Areas"
          description="Manage city and service-area pages with localized content."
        />

        <AdminCard
          href="/admin/reviews"
          title="Reviews"
          description="Create, edit, order, and publish customer reviews."
        />

        <AdminCard
          href="/admin/faq"
          title="FAQ"
          description="Manage frequently asked questions by locale and page type."
        />
      </div>
    </>
  )
}
