import { createContext, useContext, useState, ReactNode } from 'react'
import type { MediaItem } from '../types/tmdb'
import MediaModal from '../components/MediaModal'

interface ModalContextType {
  openModal: (item: MediaItem) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  return (
    <ModalContext.Provider value={{ openModal: setSelectedItem }}>
      {children}
      <MediaModal
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal debe usarse dentro de ModalProvider')
  return context
}