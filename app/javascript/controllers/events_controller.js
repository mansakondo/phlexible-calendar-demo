import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = ["eventSlot"]

  connect () {
    super.connect()
  }

  startResize(event) {
    const { date, eventId } = event.params

    this.selectedDate = date
    this.selectedEvent = event.target
    this.resizeEvent = this.resizeEvent.bind(this)

    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.addEventListener("mouseover", this.resizeEvent)
    })
  }

  resizeEvent(event) {
    const newTime = event.target.dataset.time
    const selectedEventId = this.selectedEvent.dataset.eventId

    this.stimulate("Events#update_time", selectedEventId, this.selectedDate, newTime)
  }

  stopResize(event) {
    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.removeEventListener("mouseover", this.resizeEvent)
    })
  }
}
