import {
  Button,
  FormField,
  Input,
  Select,
  Textarea,
} from "@/components/ui";

export function BookingForm() {
  return (
    <form className="flex flex-col gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="booking-first-name" label="First name">
          <Input
            id="booking-first-name"
            name="firstName"
            type="text"
            placeholder="Priya"
          />
        </FormField>
        <FormField id="booking-last-name" label="Last name">
          <Input
            id="booking-last-name"
            name="lastName"
            type="text"
            placeholder="Sharma"
          />
        </FormField>
      </div>
      <FormField id="booking-email" label="Email">
        <Input
          id="booking-email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />
      </FormField>
      <FormField id="booking-event-type" label="Event type">
        <Select id="booking-event-type" name="eventType" defaultValue="">
          <option value="">Select an event type</option>
          <option value="bridal">Bridal / Wedding</option>
          <option value="mehndi">Mehndi Ceremony</option>
          <option value="birthday">Birthday Party</option>
          <option value="festival">Festival / Event</option>
          <option value="custom">Custom Design</option>
        </Select>
      </FormField>
      <FormField id="booking-message" label="Message">
        <Textarea
          id="booking-message"
          name="message"
          rows={4}
          placeholder="Tell us about your event, date, and any design preferences..."
        />
      </FormField>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
