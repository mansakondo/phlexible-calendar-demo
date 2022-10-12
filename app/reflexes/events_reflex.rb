# frozen_string_literal: true

class EventsReflex < ApplicationReflex
  def resize(event_id, selected_date, new_time, position)
    if event_id.present? && (event = Event.find(event_id))
      new_time = Time.parse(new_time, Date.parse(selected_date))

      case position
      when "end"
        time_attribute = event.end_attribute
      when "start"
        time_attribute = event.start_attribute
      end

      event.update(:"#{time_attribute}" => new_time)
    end
  end

  def drop(event_id, selected_date, new_time)
    if event_id.present? && (event = Event.find(event_id))
      start_attribute = event.start_attribute
      end_attribute = event.end_attribute
      duration_in_seconds = (event.public_send(end_attribute) - event.public_send(start_attribute)).to_i

      new_start_time = Time.parse(new_time, Date.parse(selected_date))
      new_end_time = new_start_time.advance(seconds: duration_in_seconds)

      event.update(:"#{start_attribute}" => new_start_time, :"#{end_attribute}" => new_end_time)
    end
  end
end
