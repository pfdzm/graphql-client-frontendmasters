import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const ALL_PETS = gql`
  query AllPets {
    pets {
      id
      name
      type
      img
    }
  }
`

const CREATE_PET = gql`
  mutation AddPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
`

export default function Pets() {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(ALL_PETS)
  const [
    createPet,
    { createPetData, createPetLoading, createPetError },
  ] = useMutation(CREATE_PET)

  const onSubmit = (input) => {
    createPet({
      variables: {
        newPet: {
          name: input.name,
          type: input.type,
        },
      },
    })
    setModal(false)
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  if (loading || createPetLoading) {
    return <Loader />
  }

  if (error || createPetLoading) {
    return <h1>Error!</h1>
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  )
}
