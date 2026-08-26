// ROUTE: /contact - retained only to redirect old links to the consolidated About page.
import { redirect } from "next/navigation";

export default function ContactPage() {
  redirect("/about");
}
