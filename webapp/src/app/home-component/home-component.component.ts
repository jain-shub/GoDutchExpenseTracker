import { Component, OnInit } from "@angular/core";

/**
 * Component class for the Home Component.
 *
 * @author jain-shub
 */
@Component({
  selector: "app-home-component",
  templateUrl: "./home-component.component.html",
  styleUrls: ["./home-component.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  /**
   * Array for icons.
   */
  iconPosition = [
    { name: "business", icon: "attach_money" },
    { name: "household", icon: "home" },
    { name: "trips", icon: "commute" },
    { name: "shopping and parties", icon: "shopping_basket" },
  ];
  reflectIcon = this.iconPosition[0];

  changeIcon(pos) {
    switch (pos) {
      case "0":
        this.reflectIcon = this.iconPosition[0];
        break;
      case "1":
        this.reflectIcon = this.iconPosition[1];
        break;
      case "2":
        this.reflectIcon = this.iconPosition[2];
        break;
      case "3":
        this.reflectIcon = this.iconPosition[3];
        break;
      default:
        this.reflectIcon = this.iconPosition[0];
    }
  }

  /**
   * Array for values.
   */
  tabVal = [
    {
      id: 1,
      name: "TRACK BALANCES",
      title: "Track of shared expenses, balances, and who owes who",
      icon: "track_changes",
    },
    {
      id: 2,
      name: "ORGANIZE EXPENSES",
      title:
        "Split expenses with any group: trips, friends, housemates and family",
      icon: "vertical_split",
    },
    {
      id: 3,
      name: "BANKING",
      title: "Easily link your bank accounts and manage your transactions",
      icon: "note_add",
    },
    {
      id: 4,
      name: "PAY FRIENDS BACK",
      title: "Settle up with a friend and record any cash or online payment",
      icon: "swap_horiz",
    },
  ];

  /**
   * Array for testimonies.
   */
  testimonials = [
    {
      name: "Shubham Jain",
      category: "Traveller",
      image: "../../assets/shubham.jpg",
      statement:
        "Travelling to different places with my friends is what defines my life, sharing amount would have been a pain if not for GoDutch. I would say Lets GoDutch!",
    },
    {
      name: "Sarthak Goel",
      category: "Chef",
      image: "../../assets/sarthak.jpg",
      statement:
        "Sharing money for house hold and groceries has never been this easy. Now whatever a roommate shares goes into his account, great relief to mismanaged money.",
    },
    {
      name: "Rohan Bharti",
      category: "Business Man",
      image: "../../assets/rohan.jpg",
      statement:
        "Working in a business purchasing raw material, machinery and dividing it thorugh partners would get problematic if it is not on the go. GoDutch!.",
    },
  ];
}
