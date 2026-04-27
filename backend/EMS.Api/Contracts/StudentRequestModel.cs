namespace EMS.Api.Contracts
{
    public class StudentRequestModel
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string AdmissionNumber { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string Section { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
    }
}