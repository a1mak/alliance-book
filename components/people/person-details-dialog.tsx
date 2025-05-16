"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Person } from "@/generated/swapiSchema"
import { Avatar } from "../avatar"
import { Description } from "@radix-ui/react-dialog"

type PersonDetail = Partial<
  Record<
    keyof Person,
    {
      label: string
      units?: string
    }
  >
>

const personDetails: PersonDetail = {
  birth_year: { label: "Birth Year" },
  height: { label: "Height", units: "cm" },
  mass: { label: "Mass", units: "kg" },
  hair_color: { label: "Hair Color" },
  skin_color: { label: "Skin Color" },
  eye_color: { label: "Eye Color" },
  gender: { label: "Gender" },
}

interface PersonDetailsDialogProps {
  person: Person | null
  isOpen: boolean
  onClose: () => void
}

export const PersonDetailsDialog = ({
  person,
  isOpen,
  onClose,
}: PersonDetailsDialogProps) => {
  if (!person) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar
              personId={person.url.split("/").slice(-2, -1)[0]}
              alt={person.name}
              className="w-20 h-20"
            />
            {person.name}
          </DialogTitle>
        </DialogHeader>
        <Description className="text-sm text-muted-foreground">
          <span className="font-medium">Person info</span>
        </Description>
        <div className="grid gap-4">
          {Object.entries(personDetails).map(([key, { label, units }]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">{label}</span>
              <span className="col-span-3">
                {person[key as keyof Person]}
                {units}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
