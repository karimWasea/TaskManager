using FluentValidation;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Validators;

public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Task title is required.").MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Status).NotEmpty().Must(BeValidStatus)
            .WithMessage("Status must be one of: ToDo, InProgress, Done");
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("ProjectId is required.");
    }

    private static bool BeValidStatus(string status) =>
        Enum.TryParse<TaskItemStatus>(status, true, out _);
}

public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto>
{
    public UpdateTaskDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Task title is required.").MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Status).NotEmpty().Must(BeValidStatus)
            .WithMessage("Status must be one of: ToDo, InProgress, Done");
    }

    private static bool BeValidStatus(string status) =>
        Enum.TryParse<TaskItemStatus>(status, true, out _);
}
