import { Star } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Rankings() {
  const rankings = [
    {
      dogName: 'Team Lightning',
      handlerName: 'Alice Johnson',
      rating: 5,
      image: '/placeholder.svg?height=50&width=50',
    },
    {
      dogName: 'Team Thunder',
      handlerName: 'Mark Smith',
      rating: 5,
      image: '/placeholder.svg?height=50&width=50',
    },
    {
      dogName: 'Content',
      handlerName: 'Content',
      rating: 5,
      image: '/placeholder.svg?height=50&width=50',
    },
  ]

  return (
    <section className="py-12 px-6 sm:px-12">
      <h2 className="text-2xl font-bold text-center">Rankings</h2>
      <p className="text-center text-muted-foreground mt-2">
        Revisa los rankings de la última competencia
      </p>
      <div className="flex gap-4 justify-center my-8">
        <Button 
          variant="outline" 
          className="bg-white hover:bg-gray-50"
        >
          Categoría
        </Button>
        <Button 
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          Grado
        </Button>
        <Button 
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          Dous
        </Button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Dog Name</th>
              <th className="text-left p-4">Handler Name</th>
              <th className="text-left p-4">Ranking</th>
              <th className="text-left p-4">Dog Image</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{ranking.dogName}</td>
                <td className="p-4">{ranking.handlerName}</td>
                <td className="p-4">
                  <div className="flex">
                    {Array(ranking.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Image
                    src={ranking.image}
                    alt={`${ranking.dogName}'s photo`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </td>
                <td className="p-4">
                  <Button 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

