import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = ["eventSlot"]

  connect () {
    super.connect()
  }

  startResize(event) {
    event.preventDefault()
    const calendarEventTarget = event.target.closest("[data-event-id]")
    const { date, eventId } = calendarEventTarget.dataset
    const { position } = event.params

    this.selectedDate = date
    this.selectedEvent = calendarEventTarget
    this.resizeStartPostion = position
    this.resizeEvent = this.resizeEvent.bind(this)

    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.addEventListener("mouseover", this.resizeEvent)
    })
  }

  resizeEvent(event) {
    const target = event.target

    if (target.dataset.eventsTarget == "eventSlot") {
      const { time } = target.dataset
      const selectedEventId = this.selectedEvent.dataset.eventId
      this.stimulate("Events#resize", selectedEventId, this.selectedDate, time, this.resizeStartPostion)
    } else {
      event.preventDefault()
      return
    }
  }

  stopResize() {
    this.eventSlotTargets.forEach((eventSlotTarget) => {
      eventSlotTarget.removeEventListener("mouseover", this.resizeEvent)
    })
  }

  startDrag(event) {
    this.stopResize()
    event.dataTransfer.setData("text/plain", event.target.dataset.eventId)
  }

  setDropEffect(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  drop(event) {
    this.stopResize()
    const event_id = event.dataTransfer.getData("text/plain")
    const { date, time } = event.target.dataset

    this.stimulate("Events#drop", event_id, date, time)
  }
}
