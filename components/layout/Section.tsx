interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export const Section = (props: SectionProps) => {

  return (
    <div className="my-8">
      <div>
        <h1 className="text-lg font-semibold flex items-center gap-2 mb-4">
          {props.icon}{props.title}
        </h1>
      </div>
      {props.children}
    </div>
  )
}