import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react'

import { BaseSyntheticEvent, useState } from 'react'
import { deleteOneAllFAQs } from '../../api/servicesApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'


interface DeleteVerificationModalProps{
  isOpen: boolean
  onClose: () => void
  sp_username: string
  service_name: string
}

export default function DeleteVerificationModal({isOpen, onClose, sp_username, service_name}: DeleteVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const toast = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteOneAllFAQs,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["services", sp_username, service_name]})
      setIsLoading(false)
      onClose()
      toast({
        "title": "FAQs deleted successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (res: AxiosError) => {
      toast({
        title: res.response?.data ? `Error: ${Object.entries(res.response?.data)[0][1]}` : `Error: ${res.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
      onClose()
    }
  })

  const handleDelete = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    mutation.mutate({sp_username, service_name})
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {
        isLoading ?
        <Spinner/> :
        (<ModalContent>
        <ModalHeader>Are you sure you want to delete?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>All FAQs will be deleted. This action can't be undone.</Text>
        </ModalBody>
        <ModalFooter justifyContent="center" gap = "4">
          <Button onClick={(e) => {handleDelete(e)}} color = "white" bg = "secondary.400" _hover = {{bg: "secondary.500"}}>Yes</Button>
          <Button onClick={onClose} color = "white" bg = "red.500" _hover = {{bg: "red.600"}}>No</Button>
        </ModalFooter>
      </ModalContent>)
      }
    </Modal>
  )
}
