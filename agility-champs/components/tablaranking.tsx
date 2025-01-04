"use client";
import { rankings } from '@/data/rankingData.js';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';


export  function TablaRankingOri() {
  return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Nombre Perro</th>
                <th className="text-left p-4">Nombre Guía</th>
                <th className="text-left p-4">Grado</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Ranking</th>
                <th className="text-left p-4">Foto</th>
                <th className="text-left p-4">Más detalles</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{ranking.dogName}</td>
                  <td className="p-4">{ranking.handlerName}</td>
                  <td className="p-4">{ranking.grado}</td>
                  <td className="p-4">{ranking.categoria}</td>
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
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }

