var tour = new Tour({
  debug: true,
  storage: false,
  container: "body",
  smartPlacement: true,
  steps: [
    {
      element: ".react-bs-table-search-form",
      title: "Search Items !",
      content: "Search any of the item from the table needs to be displayed.",
      placement: "left"
    },
    {
      element: "#table",
      title: "Items",
      content: "Items information are shown in table. If you want you enter quantity please click on the corresponding item quantity cell to enble input field.",
      placement: "top",
    },
    {
      element: ".savebtn",
      title: "Save",
      content: "After entering quantity please click SAVE",
      placement: "bottom",
    },
    {
      element: ".user-icon",
      title: "Logout",
      content: "Click on this icon to logout",
      placement: "bottom",
    }
  ]
});

setTimeout(() => {
  tour.init();
  tour.start();
}, 3000);