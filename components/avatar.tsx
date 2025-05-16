import { cn } from "@/lib/utils"
import Image from "next/image"
import { type ComponentPropsWithoutRef } from "react"

interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof Image>, "src"> {
  personId: string
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  personId,
  ...propsRest
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt is part of the propsRest which is derived from next/image
    <Image
      className={cn("rounded-full object-cover w-10 h-10", className)}
      width={40}
      height={40}
      src={`https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${personId}.jpg`}
      {...propsRest}
    />
  )
}
