import { Button } from '@/components/ui/button'

export function Registration() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-indigo-600 p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Regístrate</h2>
        <p className="mb-8 text-indigo-100">
          Our free plan shows you what this app can do. No credit card required.
        </p>
        <Button 
          variant="secondary"
          className="bg-white text-indigo-600 hover:bg-indigo-50"
        >
          Join for free
        </Button>
      </div>
      <div className="bg-gray-100 p-12 flex items-center justify-center">
        <div className="w-48 h-48 relative">
          <svg
            viewBox="0 0 200 200"
            className="text-teal-500"
          >
            <path
              fill="currentColor"
              d="M100 20c44.1 0 80 35.9 80 80s-35.9 80-80 80-80-35.9-80-80 35.9-80 80-80zm20 100l-40-40v80l40-40z"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

