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
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        <AdminCard
          href="/admin/settings"
          title="Settings"
          description="Brand, phone, email, hours, and global website settings."
        />
        <AdminCard
          href="/admin/home"
          title="Home"
          description="Hero section, CTA blocks, homepage texts, and badges."
        />
        <AdminCard
          href="/admin/services"
          title="Services"
          description="Manage service pages, content blocks, and SEO fields."
        />
        <AdminCard
          href="/admin/areas"
          title="Areas"
          description="Manage city pages and location coverage content."
        />
        <AdminCard
          href="/admin/reviews"
          title="Reviews"
          description="Add, edit, sort, and publish customer reviews."
        />
        <AdminCard
          href="/admin/faq"
          title="FAQ"
          description="Manage questions and answers by locale and page."
        />
      </div>
    </>
  )
}
