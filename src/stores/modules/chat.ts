import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    isInChatPage: false,
    isDanliaoquanliaoDialogShow: false,
    isAddGroupShow: false,
  }),
  actions: {
    setChatStatus(isInChat: boolean) {
      this.isInChatPage = isInChat
    },
    setDanliaoquanliaoDialogShow(danliaoquanliaoDialogShow: boolean) {
      this.isDanliaoquanliaoDialogShow = danliaoquanliaoDialogShow
    },
    setAddGroupShow(addGroupShow: boolean) {
      this.isAddGroupShow = addGroupShow
    },
  },
})

export default useChatStore
