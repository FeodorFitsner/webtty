using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WebTty.Exec;

namespace WebTty.Examples
{
    class Program
    {
        static void Main(string[] args)
        {
            var attr = new ProcAttr
            {
                RedirectStdout = true,
                Sys = new SysProcAttr
                {
                    UseTty = true
                }
            };

            // This one works
            //var process = Process.Start("bash", new string[] { "-c", "ls --color=auto" }, attr);

            // This one doesn't work
            var process = Process.Start("pwsh", new string[] { "-command", "ls --color=auto" }, attr);

            var t = ReadStdOut(process, process.Stdout);

            process.Wait();
            Console.WriteLine($"Exited with {process.ExitCode}");
        }

        private static async Task ReadStdOut(IProcess process, StreamReader reader)
        {
            const int maxReadSize = 1024;
            var buffer = new char[maxReadSize];

            while (process.IsRunning)
            {
                try
                {
                    var read = await reader.ReadAsync(buffer, 0, maxReadSize);

                    var ds = new string(buffer, 0, read);
                    Console.Write(ds.Replace("\u001b", ""));

                    await Console.Out.FlushAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    break;
                }
            }
        }
    }
}
