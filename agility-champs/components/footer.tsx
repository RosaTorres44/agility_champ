import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-4">Subscribe to our newsletter</h3>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Input your email"
              className="bg-gray-800 border-gray-700"
            />
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Subscribe
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8 py-8 border-t border-gray-800">
          <div className="col-span-2">
            <h4 className="font-bold mb-4">Agility Champs</h4>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Pricing</h5>
          </div>
          <div>
            <h5 className="font-semibold mb-2">About us</h5>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Features</h5>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Help Center</h5>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Careers</h5>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 Brand, Inc. • Privacy • Terms • Sitemap</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

