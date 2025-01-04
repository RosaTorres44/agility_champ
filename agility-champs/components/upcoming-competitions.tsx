export function UpcomingCompetitions() {
  const competitions = [
    {
      title: 'Agility For All',
      date: 'Nov 1, 2023',
      time: '10:00 AM',
      duration: '2h',
    },
    {
      title: 'Speed Challenge',
      date: 'Nov 3, 2023',
      time: '1:00 PM',
      duration: '3h',
    },
    {
      title: 'Endurance Race',
      date: 'Nov 5, 2023',
      time: '9:00 AM',
      duration: '1.5h',
    },
    {
      title: 'Relay Marathon',
      date: 'Nov 7, 2023',
      time: '11:00 AM',
      duration: '2.5h',
    },
  ]

  return (
    <section className="py-12 px-6 bg-gray-50 sm:px-12">
      <h2 className="text-2xl font-bold text-center mb-8">Upcoming Competitions</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {competitions.map((competition, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-2">{competition.title}</h3>
            <p className="text-sm text-muted-foreground">Date: {competition.date}</p>
            <p className="text-sm text-muted-foreground">Time: {competition.time}</p>
            <p className="text-sm text-muted-foreground">Duration: {competition.duration}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

