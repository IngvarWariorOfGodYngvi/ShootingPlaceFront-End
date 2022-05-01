export default {
  name: 'dateConverter',
  methods: {
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      const formattedDate = day + '-' + (month) + '-' + current.getFullYear()
      return formattedDate
    }
  }
}
