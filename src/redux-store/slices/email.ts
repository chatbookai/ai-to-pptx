// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

// Type Imports
import type { Email, EmailState } from '@/types/apps/emailTypes'

// Constants
const initialState: EmailState = {
  emails: [],
  filteredEmails: []
}

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    // Filter all emails based on folder and label
    filterEmails: (state, action) => {
      const { emails, folder, label, uniqueLabels } = action.payload

      state.filteredEmails = emails.filter((email: Email) => {
        if (folder === 'starred' && email.folder !== 'trash') {
          return email.isStarred
        } else if (uniqueLabels.includes(label) && email.folder !== 'trash') {
          return email.labels.includes(label)
        } else {
          return email.folder === folder
        }
      })
    },

    // Move all selected emails to folder
    moveEmailsToFolder: (state, action) => {
      const { emailIds, folder } = action.payload

      state.emails = state.emails.map(email => {
        return emailIds.includes(email.id) ? { ...email, folder } : email
      })
    },

    // Delete all selected emails from trash
    deleteTrashEmails: (state, action) => {
      const { emailIds } = action.payload

      state.emails = state.emails.filter(email => !emailIds.includes(email.id))
    },

    // Toggle read/unread status of all selected emails
    toggleReadEmails: (state, action) => {
      const { emailIds } = action.payload

      const doesContainUnread = state.filteredEmails
        .filter(email => emailIds.includes(email.id))
        .some(email => !email.isRead)

      const areAllUnread = state.filteredEmails
        .filter(email => emailIds.includes(email.id))
        .every(email => !email.isRead)

      const areAllRead = state.filteredEmails.filter(email => emailIds.includes(email.id)).every(email => email.isRead)

      state.emails = state.emails.map(email => {
        if (emailIds.includes(email.id) && (doesContainUnread || areAllUnread)) {
          return { ...email, isRead: true }
        } else if (emailIds.includes(email.id) && areAllRead) {
          return { ...email, isRead: false }
        }

        return email
      })
    },

    // Toggle label to all selected emails
    toggleLabel: (state, action) => {
      const { emailIds, label } = action.payload

      state.emails = state.emails.map(email => {
        if (emailIds.includes(email.id)) {
          return email.labels.includes(label)
            ? { ...email, labels: email.labels.filter(l => l !== label) }
            : { ...email, labels: [...email.labels, label] }
        }

        return email
      })
    },

    // Toggle starred status of email
    toggleStarEmail: (state, action) => {
      const { emailId } = action.payload

      state.emails = state.emails.map(email => {
        return email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      })
    },

    // Get current email and mark it as read
    getCurrentEmail: (state, action) => {
      state.currentEmailId = action.payload

      state.emails = state.emails.map(email => {
        return email.id === action.payload && !email.isRead ? { ...email, isRead: true } : email
      })
    },

    // Navigate to next or previous email
    navigateEmails: (state, action) => {
      const { type, emails: filteredEmails, currentEmailId } = action.payload

      const currentIndex = filteredEmails.findIndex((email: Email) => email.id === currentEmailId)

      if (type === 'next' && currentIndex < filteredEmails.length - 1) {
        state.currentEmailId = filteredEmails[currentIndex + 1].id
      } else if (type === 'prev' && currentIndex > 0) {
        state.currentEmailId = filteredEmails[currentIndex - 1].id
      }

      // Mark email as read on navigation
      if (state.currentEmailId) {
        state.emails.filter(email => email.id === state.currentEmailId)[0].isRead = true
      }
    }
  }
})

export const {
  filterEmails,
  moveEmailsToFolder,
  deleteTrashEmails,
  toggleReadEmails,
  toggleLabel,
  toggleStarEmail,
  getCurrentEmail,
  navigateEmails
} = emailSlice.actions

export default emailSlice.reducer
