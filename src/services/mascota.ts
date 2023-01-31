import { Pet } from '@prisma/client';
import { prisma } from '../database/prismaClient';
import { CustomError } from '../helpers';

export const insertPet = async (data: Pet, idVet: string): Promise<Pet> => {
  return await prisma.pet.create({
    data: {
      name: data.name,
      owner: data.owner,
      email: data.email,
      symptoms: data.symptoms,
      gender: data.gender,
      veterinary: {
        connect: {
          id: idVet
        }
      }
    }
  })
}

export const findAllPetsByVet = async (idVet: string): Promise<Pet[]> => {
  return await prisma.pet.findMany({
    where: { veterinary: { id: idVet } }
  })
}

const findPetById = async (idPet: string, idVet: string): Promise<Pet> => {
  const pet = await prisma.pet.findUnique({
    where: { id: idPet }
  })

  if (!pet)
    throw new CustomError(`Mascota con id ${ idPet } no encontrado/a`, 404)

  if (pet.veterinaryId.toString() !== idVet.toString())
    throw new CustomError('Acción no válida para este usuario', 403)

  return pet
}

export const findOnePetByVet = async (idPet: string, idVet: string): Promise<Pet> => {
  return await findPetById(idPet, idVet)
}

export const updatePetByVet = async (idPet: string, idVet: string, data: Partial<Pet>): Promise<Pet> => {
  const pet = await findPetById(idPet, idVet)

  return await prisma.pet.update({
    where: { id: pet.id },
    data: {
      name: data.name ?? pet.name,
      owner: data.owner ?? pet.owner,
      email: data.email ?? pet.email,
      date: data.date ?? pet.date,
      symptoms: data.symptoms ?? pet.symptoms,
      gender: data.gender ?? pet.gender
    }
  })
}

export const deletePetByVet = async (idPet: string, idVet: string): Promise<void> => {
  const pet = await findPetById(idPet, idVet)
  await prisma.pet.delete({ where: { id: pet.id } })
}