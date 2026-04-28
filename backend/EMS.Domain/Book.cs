namespace EMS.Domain;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Author { get; set; } = default!;
    public string ISBN { get; set; } = default!;
    public string Category { get; set; } = default!;
    public int Quantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string RackNumber { get; set; } = default!;
}
